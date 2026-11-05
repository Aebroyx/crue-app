import { storefrontGraphql } from "@/lib/storefront";

export type SizeChartRow = {
  size: string;
  values: string[];
};

export type SizeChart = {
  id: string;
  name: string;
  position: number | null;
  unitLabel: string;
  fitNote: string;
  columns: string[];
  notes: string[];
  rows: SizeChartRow[];
};

type Field = { value?: string | null } | null;

type RowNode = {
  size?: Field;
  values?: Field;
};

type ChartNode = {
  id?: string | null;
  name?: Field;
  position?: Field;
  unit_label?: Field;
  fit_note?: Field;
  columns?: Field;
  notes?: Field;
  rows?: { references?: { nodes?: RowNode[] | null } | null } | null;
};

type SizeChartPayload = {
  data?: {
    metaobjects?: {
      nodes?: ChartNode[] | null;
    } | null;
  } | null;
};

const sizeChartQuery = `
  query SizeCharts {
    metaobjects(type: "size_chart", first: 50) {
      nodes {
        id
        name: field(key: "name") { value }
        position: field(key: "position") { value }
        unit_label: field(key: "unit_label") { value }
        fit_note: field(key: "fit_note") { value }
        columns: field(key: "columns") { value }
        notes: field(key: "notes") { value }
        rows: field(key: "rows") {
          references(first: 50) {
            nodes {
              ... on Metaobject {
                size: field(key: "size") { value }
                values: field(key: "values") { value }
              }
            }
          }
        }
      }
    }
  }
`;

function textList(value: string | null | undefined) {
  if (!value?.trim()) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => (typeof item === "string" ? item.trim() : ""));
  } catch {
    return [];
  }
}

function positionOf(value: string | null | undefined) {
  const text = value?.trim() ?? "";
  if (!text) return null;
  const position = Number(text);
  return Number.isFinite(position) ? position : null;
}

export function mapSizeCharts(payload: SizeChartPayload | null): SizeChart[] {
  const nodes = payload?.data?.metaobjects?.nodes ?? [];
  const charts = nodes.flatMap((node) => {
    const id = node.id?.trim() ?? "";
    if (!id) return [];
    const rawColumns = textList(node.columns?.value);
    const rawNotes = textList(node.notes?.value);
    const kept = rawColumns.flatMap((column, index) => (column ? [{ column, index }] : []));
    const columns = kept.map((item) => item.column);
    const notes = kept.map((item) => rawNotes[item.index] ?? "");
    const rows = (node.rows?.references?.nodes ?? []).flatMap((row) => {
      const size = row.size?.value?.trim() ?? "";
      if (!size) return [];
      const rawValues = textList(row.values?.value);
      return [{ size, values: kept.map((item) => rawValues[item.index] ?? "") }];
    });
    return [
      {
        id,
        name: node.name?.value?.trim() ?? "",
        position: positionOf(node.position?.value),
        unitLabel: node.unit_label?.value?.trim() ?? "",
        fitNote: node.fit_note?.value?.trim() ?? "",
        columns,
        notes,
        rows,
      },
    ];
  });

  return orderSizeCharts(charts);
}

export function orderSizeCharts(charts: SizeChart[]) {
  return charts
    .map((chart, index) => ({ chart, index }))
    .sort((a, b) => {
      if (a.chart.position == null && b.chart.position == null) return a.index - b.index;
      if (a.chart.position == null) return 1;
      if (b.chart.position == null) return -1;
      if (a.chart.position !== b.chart.position) return a.chart.position - b.chart.position;
      return a.index - b.index;
    })
    .map((item) => item.chart);
}

export async function requestSizeCharts(fetchImpl: typeof fetch = fetch) {
  const payload = await storefrontGraphql<SizeChartPayload>(sizeChartQuery, {}, fetchImpl);
  return mapSizeCharts(payload);
}

export async function storefrontSizeCharts() {
  if (process.env.NODE_ENV === "test") return [];
  return requestSizeCharts();
}
