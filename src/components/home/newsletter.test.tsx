import { fireEvent, render, screen } from "@testing-library/react";
import { Storefront } from "@/app/page";
import { Product } from "@/components/product/product";
import { productByHandle } from "@/lib/catalog";

describe("REQ-010 newsletter band", () => {
  it("REQ-010 places the newsletter band before the footer", () => {
    render(<Storefront showIntro={false} />);

    const band = screen.getByRole("heading", { name: "Enter the orbit" });
    const tiles = screen.getByText("Layers");
    const footer = screen.getByRole("contentinfo");

    expect(tiles.compareDocumentPosition(band) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(band.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(band.closest("section")).toHaveClass("h-[460px]", "md:h-[480px]", "bg-surface");
    expect(band).toHaveClass("text-[28px]", "md:text-[40px]");
  });

  it("REQ-010 shows the orbit heading, the label, the field, and Join", () => {
    render(<Storefront showIntro={false} />);

    const field = screen.getByLabelText("Get early access to every drop.");
    expect(field).toHaveAttribute("type", "email");
    expect(field).toHaveAttribute("placeholder", "you@email.com");
    expect(screen.getByRole("button", { name: "Join" })).toBeInTheDocument();
    expect(document.querySelector('img[src="/brand/glow-light.jpg"]')).toBeTruthy();
  });

  it("REQ-010 keeps the band off the product page", () => {
    render(<Product product={productByHandle("horizon-shell-jacket")!} />);

    expect(screen.queryByRole("heading", { name: "Enter the orbit" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Join" })).not.toBeInTheDocument();
  });

  it("REQ-010 does not send the address", () => {
    render(<Storefront showIntro={false} />);

    fireEvent.change(screen.getByLabelText("Get early access to every drop."), {
      target: { value: "runner@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Join" }));

    expect(screen.queryByText(/thank|subscribed|joined/i)).not.toBeInTheDocument();
    expect(document.cookie).not.toContain("runner@example.com");
    expect(window.localStorage.getItem("runner@example.com")).toBeNull();
  });
});
