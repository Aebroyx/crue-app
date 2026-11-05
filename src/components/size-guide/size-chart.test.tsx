import fs from "node:fs";
import path from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { Storefront } from "@/app/page";
import { Footer } from "@/components/footer/footer";
import { Product } from "@/components/product/product";
import { SizeChartProvider } from "@/components/size-chart-context";
import { productByHandle } from "@/lib/catalog";
import { requestSizeCharts, type SizeChart } from "@/lib/size-chart";

const fitNote =
  "If you're between sizes, choose your preferred fit. Size up for a more relaxed fit or size down for a closer fit.";

const tee: SizeChart = {
  id: "gid://shopify/Metaobject/tee",
  name: "Tee",
  position: 2,
  unitLabel: "All measurements in centimeters",
  fitNote,
  columns: ["Chest", "Length"],
  notes: ["", ""],
  rows: [
    { size: "S", values: ["47", "47"] },
    { size: "M", values: ["49", "49"] },
    { size: "L", values: ["53", "53"] },
    { size: "XL", values: ["56", "56"] },
  ],
};

const jacketChart: SizeChart = {
  id: "gid://shopify/Metaobject/jacket",
  name: "Jacket",
  position: 1,
  unitLabel: "All measurements in centimeters",
  fitNote: "Jacket fit.",
  columns: ["Chest"],
  notes: [],
  rows: [{ size: "M", values: ["60"] }],
};

function list(items: string[]) {
  return JSON.stringify(items);
}

function chartNode(chart: SizeChart, values: string[][]) {
  return {
    id: chart.id,
    name: { value: chart.name },
    position: { value: chart.position == null ? "" : String(chart.position) },
    unit_label: { value: chart.unitLabel },
    fit_note: { value: chart.fitNote },
    columns: { value: list(chart.columns) },
    notes: { value: list(chart.notes) },
    rows: {
      references: {
        nodes: chart.rows.map((row, index) => ({
          size: { value: row.size },
          values: { value: list(values[index] ?? row.values) },
        })),
      },
    },
  };
}

function payload(nodes: object[] | null) {
  return {
    ok: true,
    json: async () => ({
      data: {
        metaobjects: {
          nodes: nodes ?? [],
        },
      },
    }),
  };
}

describe("REQ-035 size chart", () => {
  it("REQ-035 reads the size chart columns and rows from Shopify", async () => {
    process.env.SHOPIFY_STORE_DOMAIN = "crue-dev.myshopify.com";
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "public-token";
    const fetchImpl = jest.fn().mockResolvedValue(
      payload([
        chartNode(
          { ...jacketChart, position: null, unitLabel: "  " },
          [["60", "extra"]],
        ),
        chartNode(tee, [
          ["47"],
          ["49", "49", "99"],
          ["53", "53"],
          ["56", "56"],
        ]),
      ]),
    );

    const charts = await requestSizeCharts(fetchImpl as unknown as typeof fetch);
    const body = JSON.parse(String(fetchImpl.mock.calls[0][1].body)) as { query: string };
    const productQuery = fs.readFileSync(path.join(process.cwd(), "src/lib/storefront.ts"), "utf8");

    expect(body.query).toMatch(/metaobjects\(type:\s*"size_chart"/);
    expect(body.query).toMatch(/unit_label/);
    expect(body.query).toMatch(/fit_note/);
    expect(body.query).toMatch(/columns/);
    expect(body.query).toMatch(/field\(key: "size"\)/);
    expect(body.query).toMatch(/field\(key: "values"\)/);
    expect(productQuery).toMatch(/metafield\(namespace: "custom", key: "size_chart"\)/);
    expect(charts.map((chart) => chart.name)).toEqual(["Tee", "Jacket"]);
    expect(charts[0].rows[0].values).toEqual(["47", ""]);
    expect(charts[0].rows[1].values).toEqual(["49", "49"]);
    expect(charts[0].unitLabel).toBe(tee.unitLabel);
    expect(charts[0].fitNote).toBe(fitNote);
    expect(charts[1].unitLabel).toBe("");

    const failed = await requestSizeCharts(
      jest.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch,
    );
    expect(failed).toEqual([]);
  });

  it("REQ-035 shows the product chart and hides the control when a product has none", () => {
    const teeProduct = { ...productByHandle("singularity-run-tee")!, sizeChartId: tee.id };
    const jacket = productByHandle("horizon-shell-jacket")!;

    render(
      <SizeChartProvider charts={[tee]}>
        <Product product={teeProduct} />
      </SizeChartProvider>,
    );
    fireEvent.click(within(screen.getByRole("group", { name: "Size" })).getByRole("button", { name: "Size guide" }));
    const dialog = screen.getByRole("dialog", { name: "Size guide" });

    expect(within(dialog).getAllByRole("rowheader").map((cell) => cell.textContent)).toEqual(["S", "M", "L", "XL"]);
    expect(within(dialog).getByRole("columnheader", { name: "Chest" })).toBeInTheDocument();
    expect(within(dialog).getByRole("columnheader", { name: "Length" })).toBeInTheDocument();
    expect(within(dialog).getAllByText("47")).toHaveLength(2);
    expect(within(dialog).queryByRole("columnheader", { name: "Waist" })).not.toBeInTheDocument();
    expect(within(dialog).queryByRole("rowheader", { name: "XS" })).not.toBeInTheDocument();
    expect(within(dialog).queryByRole("heading", { name: "How to measure" })).not.toBeInTheDocument();

    render(<Product product={jacket} />);
    expect(screen.getByRole("heading", { name: "Horizon Shell Jacket" })).toBeInTheDocument();
    expect(
      within(screen.getAllByRole("group", { name: "Size" })[1]).queryByRole("button", { name: "Size guide" }),
    ).not.toBeInTheDocument();
  });

  it("REQ-035 shares one chart across two products", () => {
    const shortSleeve = { ...productByHandle("singularity-run-tee")!, sizeChartId: tee.id };
    const longSleeve = { ...productByHandle("event-horizon-long-sleeve")!, sizeChartId: tee.id };

    const first = render(
      <SizeChartProvider charts={[tee]}>
        <Product product={shortSleeve} />
      </SizeChartProvider>,
    );
    fireEvent.click(within(screen.getByRole("group", { name: "Size" })).getByRole("button", { name: "Size guide" }));
    expect(within(screen.getByRole("dialog", { name: "Size guide" })).getAllByText("56")).toHaveLength(2);
    first.unmount();

    render(
      <SizeChartProvider charts={[tee]}>
        <Product product={longSleeve} />
      </SizeChartProvider>,
    );
    fireEvent.click(within(screen.getByRole("group", { name: "Size" })).getByRole("button", { name: "Size guide" }));
    expect(within(screen.getByRole("dialog", { name: "Size guide" })).getAllByText("56")).toHaveLength(2);
  });

  it("REQ-035 lists charts from the footer and the menu and hides them when none exist", () => {
    const listed = render(
      <SizeChartProvider charts={[tee, jacketChart]}>
        <Footer />
      </SizeChartProvider>,
    );
    fireEvent.click(within(screen.getByRole("contentinfo")).getByRole("link", { name: "Size guide" }));
    const dialog = screen.getByRole("dialog", { name: "Size guide" });
    const tabs = within(dialog).getAllByRole("tab");

    expect(tabs.map((tab) => tab.textContent)).toEqual(["Jacket", "Tee"]);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(within(dialog).getByRole("cell", { name: "60" })).toBeInTheDocument();
    fireEvent.click(tabs[1]);
    expect(within(dialog).getAllByText("47")).toHaveLength(2);
    listed.unmount();

    render(
      <SizeChartProvider charts={[tee, jacketChart]}>
        <Storefront showIntro={false} />
      </SizeChartProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    fireEvent.click(within(screen.getByRole("dialog", { name: "Menu" })).getByRole("button", { name: "Size guide" }));
    expect(screen.getAllByRole("tab").map((tab) => tab.textContent)).toEqual(["Jacket", "Tee"]);

    render(<Footer />);
    expect(within(screen.getAllByRole("contentinfo").at(-1)!).queryByRole("link", { name: "Size guide" })).toBeNull();

    render(<Storefront showIntro={false} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Menu" }).at(-1)!);
    expect(
      within(screen.getByRole("dialog", { name: "Menu" })).queryByRole("button", { name: "Size guide" }),
    ).not.toBeInTheDocument();
  });

  it("REQ-035 does not show the placeholder chart", () => {
    const teeProduct = { ...productByHandle("singularity-run-tee")!, sizeChartId: tee.id };
    render(
      <SizeChartProvider charts={[tee]}>
        <Product product={teeProduct} />
      </SizeChartProvider>,
    );
    fireEvent.click(within(screen.getByRole("group", { name: "Size" })).getByRole("button", { name: "Size guide" }));
    const dialog = screen.getByRole("dialog", { name: "Size guide" });

    expect(within(dialog).queryByRole("tab", { name: "Tops" })).not.toBeInTheDocument();
    expect(within(dialog).queryByRole("tab", { name: "Bottoms" })).not.toBeInTheDocument();
    expect(within(dialog).queryByRole("button", { name: "cm" })).not.toBeInTheDocument();
    expect(within(dialog).queryByRole("button", { name: "in" })).not.toBeInTheDocument();
    expect(within(dialog).queryByText("[cm]")).not.toBeInTheDocument();
    expect(within(dialog).queryByText("[in]")).not.toBeInTheDocument();
  });
});
