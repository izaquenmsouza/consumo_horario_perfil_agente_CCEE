const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");
const links = [...document.querySelectorAll(".nav-links a")];
const sections = links
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

links.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      links.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0.01,
  }
);

sections.forEach((section) => observer.observe(section));

const palette = {
  ink: "#18181b",
  muted: "#71717a",
  line: "#e4e4e7",
  blue: "#2563eb",
  teal: "#0f766e",
  amber: "#b45309",
};

const formatPt = (value) =>
  new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: value < 100 ? 2 : 0,
  }).format(value);

function setupCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = rect.width * ratio;
  const cssHeight = rect.height || Number(canvas.getAttribute("height"));
  canvas.height = cssHeight * ratio;
  ctx.scale(ratio, ratio);
  return { ctx, width: rect.width, height: cssHeight };
}

function drawAxes(ctx, width, height, padding) {
  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, height - padding.bottom);
  ctx.lineTo(width - padding.right, height - padding.bottom);
  ctx.stroke();
}

function drawLineChart(canvas, labels, series, options = {}) {
  if (!canvas) return;
  const { ctx, width, height } = setupCanvas(canvas);
  const padding = { top: 22, right: 22, bottom: 46, left: 58 };
  const values = series.flatMap((item) => item.values);
  const min = options.min ?? Math.min(...values);
  const max = options.max ?? Math.max(...values);
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const y = (value) => padding.top + (1 - (value - min) / (max - min)) * plotHeight;
  const x = (index) => padding.left + (index / (labels.length - 1)) * plotWidth;

  ctx.clearRect(0, 0, width, height);
  drawAxes(ctx, width, height, padding);

  ctx.fillStyle = palette.muted;
  ctx.font = "12px Inter, system-ui, sans-serif";
  const tickEvery = options.xTickEvery ?? (labels.length > 12 ? 2 : 1);
  labels.forEach((label, index) => {
    if (index % tickEvery !== 0) return;
    ctx.fillText(label, x(index) - 14, height - 18);
  });

  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i += 1) {
    const value = min + ((max - min) / gridSteps) * i;
    const yPos = y(value);
    ctx.strokeStyle = palette.line;
    ctx.beginPath();
    ctx.moveTo(padding.left, yPos);
    ctx.lineTo(width - padding.right, yPos);
    ctx.stroke();
    ctx.fillStyle = palette.muted;
    ctx.fillText(formatPt(value), 8, yPos + 4);
  }

  series.forEach((item) => {
    ctx.strokeStyle = item.color;
    ctx.fillStyle = item.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    item.values.forEach((value, index) => {
      const pointX = x(index);
      const pointY = y(value);
      if (index === 0) ctx.moveTo(pointX, pointY);
      else ctx.lineTo(pointX, pointY);
    });
    ctx.stroke();

    item.values.forEach((value, index) => {
      ctx.beginPath();
      ctx.arc(x(index), y(value), 3, 0, Math.PI * 2);
      ctx.fill();
    });
  });

  let legendX = padding.left;
  series.forEach((item) => {
    ctx.fillStyle = item.color;
    ctx.fillRect(legendX, 10, 10, 10);
    ctx.fillStyle = palette.ink;
    ctx.fillText(item.label, legendX + 16, 19);
    legendX += ctx.measureText(item.label).width + 48;
  });
}

function drawBarChart(canvas, labels, values, options = {}) {
  if (!canvas) return;
  const { ctx, width, height } = setupCanvas(canvas);
  const horizontal = options.horizontal;
  const padding = horizontal
    ? { top: 18, right: 36, bottom: 24, left: 52 }
    : { top: 24, right: 18, bottom: 44, left: 46 };
  const max = options.max ?? Math.max(...values);
  ctx.clearRect(0, 0, width, height);
  drawAxes(ctx, width, height, padding);
  ctx.font = "12px Inter, system-ui, sans-serif";

  if (horizontal) {
    const gap = 6;
    const plotHeight = height - padding.top - padding.bottom;
    const barHeight = Math.max(9, (plotHeight - gap * (labels.length - 1)) / labels.length);
    const plotWidth = width - padding.left - padding.right;
    values.forEach((value, index) => {
      const y = padding.top + index * (barHeight + gap);
      const barWidth = (value / max) * plotWidth;
      ctx.fillStyle = palette.blue;
      ctx.fillRect(padding.left, y, barWidth, barHeight);
      ctx.fillStyle = palette.ink;
      ctx.fillText(labels[index], 12, y + barHeight - 1);
      ctx.fillStyle = palette.muted;
      ctx.fillText(`${formatPt(value)}%`, padding.left + barWidth + 6, y + barHeight - 1);
    });
    return;
  }

  const gap = 18;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const barWidth = (plotWidth - gap * (labels.length - 1)) / labels.length;
  values.forEach((value, index) => {
    const barHeight = (value / max) * plotHeight;
    const x = padding.left + index * (barWidth + gap);
    const y = height - padding.bottom - barHeight;
    ctx.fillStyle = palette.blue;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.fillStyle = palette.muted;
    ctx.fillText(labels[index], x, height - 18);
    ctx.fillText(`${formatPt(value)}%`, x, y - 6);
  });
}

function renderCharts() {
  const isMobile = window.matchMedia("(max-width: 640px)").matches;
  const dailySeries = [
    {
      label: "ACL médio diário",
      color: palette.blue,
      values: [1633681.22, 1663865.15, 1652745.42, 1701613.32, 1716079.01, 1783072.63],
    },
    {
      label: "Ajustado médio diário",
      color: palette.amber,
      values: [1633692.17, 1663878.84, 1652764.55, 1701629.28, 1716093.58, 1783087.94],
    },
    {
      label: "Ponto de conexão",
      color: palette.teal,
      values: [1600775.98, 1631520.33, 1619698.58, 1665002.97, 1674582.0, 1737780.61],
    },
  ];
  drawLineChart(
    document.querySelector("#dailyMonthChart"),
    ["202509", "202510", "202511", "202512", "202601", "202602"],
    isMobile ? [dailySeries[0]] : dailySeries,
    { min: 1580000, max: 1800000 }
  );

  drawBarChart(
    document.querySelector("#submarketChart"),
    ["SUDESTE", "SUL", "NORDESTE", "NORTE"],
    [55.92, 17.53, 15.89, 10.65],
    { max: 60 }
  );

  drawBarChart(
    document.querySelector("#stateChart"),
    ["SP", "MG", "RJ", "PR", "SC", "BA", "PA", "RS", "GO", "PE", "MA", "CE", "ES", "MT", "AM"],
    [26.7, 10.69, 8.77, 6.29, 5.36, 5.23, 4.91, 4.9, 3.16, 3.08, 2.87, 2.81, 2.24, 2.02, 1.87],
    { horizontal: true, max: 28 }
  );

  drawLineChart(
    document.querySelector("#hourlyChart"),
    [...Array(24)].map((_, index) => String(index)),
    [
      {
        label: "ACL",
        color: palette.blue,
        values: [
          75639.19, 72342.57, 70072.7, 68683.03, 68244.04, 67932.68, 66304.72, 63375.26,
          60252.8, 56906.53, 55598.08, 55482.62, 54978.77, 58131.93, 62728.15, 68198.54,
          74548.92, 79649.24, 85173.62, 88275.9, 87734.15, 86696.38, 83991.04, 79927.18,
        ],
      },
      {
        label: "Ponto de conexão",
        color: palette.teal,
        values: [
          74058.73, 70785, 68522.32, 67130.28, 66686.39, 66369.24, 64760.27, 61845.73,
          58783.53, 55590.21, 54464.32, 54412.02, 53936.64, 56866.8, 61223.29, 66523.93,
          72830.3, 77941.85, 83376.28, 86430.69, 85935.38, 84942.06, 82298.55, 78299.23,
        ],
      },
    ],
    { min: 52000, max: 90000, xTickEvery: isMobile ? 3 : 2 }
  );

  drawLineChart(
    document.querySelector("#differenceChart"),
    ["202509", "202510", "202511", "202512", "202601", "202602"],
    [
      {
        label: "Diferença percentual",
        color: palette.amber,
        values: [2.01, 1.94, 2.0, 2.15, 2.42, 2.54],
      },
    ],
    { min: 1.8, max: 2.7 }
  );
}

window.addEventListener("load", renderCharts);
window.addEventListener("resize", () => {
  window.clearTimeout(window.chartResizeTimer);
  window.chartResizeTimer = window.setTimeout(renderCharts, 120);
});
