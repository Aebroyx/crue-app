import { act, fireEvent, render, screen } from "@testing-library/react";
import { Catalog } from "@/components/catalog/catalog";
import { Home } from "@/components/home/home";

function setScroll(value: number) {
  Object.defineProperty(window, "scrollY", { value, configurable: true });
  fireEvent.scroll(window);
}

function headers() {
  return {
    desktop: screen.getByRole("navigation", { name: "Main" }).closest("header"),
    phone: screen.getByRole("button", { name: "Menu" }).closest("header"),
  };
}

describe("REQ-032 sticky nav", () => {
  afterEach(() => {
    setScroll(0);
  });

  it("REQ-032 shows a transparent home nav over the banner and leaves the announcement in the page", () => {
    render(<Home />);
    const { desktop, phone } = headers();
    const announcement = screen.getByText("Drop 001, out now").parentElement;
    const banner = document.querySelector("section");

    for (const name of ["Search", "Account", "BAG (0)"]) {
      expect(screen.getAllByRole("button", { name }).every((button) => button.classList.contains("cursor-pointer"))).toBe(true);
    }
    expect(announcement).not.toHaveClass("sticky");
    expect(announcement).toHaveClass("bg-surface");
    expect(desktop).toHaveClass("sticky", "top-0", "bg-transparent", "border-transparent", "duration-300");
    expect(desktop).toHaveAttribute("data-nav-on-photo");
    expect(desktop?.querySelector("img[src='/brand/crue-wordmark-white.png']")).toHaveClass("opacity-100");
    expect(desktop?.querySelector("img[src='/brand/crue-wordmark-black.png']")).toHaveClass("opacity-0");
    expect(desktop).not.toHaveClass("bg-bg");
    expect(phone).toHaveClass("bg-transparent", "border-transparent");
    expect(phone).toHaveAttribute("data-nav-on-photo");
    expect(banner).toHaveClass("-mt-[60px]", "md:-mt-[72px]");
  });

  it("REQ-032 sticks the nav and fills it with the theme background after scroll", () => {
    render(<Home />);
    const { desktop, phone } = headers();

    act(() => {
      setScroll(80);
    });

    expect(desktop).toHaveClass("sticky", "top-0", "bg-bg", "border-line");
    expect(desktop).not.toHaveAttribute("data-nav-on-photo");
    expect(desktop?.querySelector("img[src='/brand/crue-wordmark-black.png']")).toBeTruthy();
    expect(desktop).not.toHaveClass("bg-transparent");
    expect(phone).toHaveClass("bg-bg", "border-line");

    act(() => {
      setScroll(0);
    });

    expect(desktop).toHaveClass("bg-transparent");
    expect(desktop).toHaveAttribute("data-nav-on-photo");
    expect(phone).toHaveClass("bg-transparent");
  });

  it("REQ-032 keeps the nav solid off the home page", () => {
    render(<Catalog />);
    const { desktop, phone } = headers();

    expect(desktop).toHaveClass("sticky", "top-0", "bg-bg", "border-line");
    expect(desktop).not.toHaveAttribute("data-nav-on-photo");
    expect(desktop?.querySelector("img[src='/brand/crue-wordmark-black.png']")).toBeTruthy();
    expect(desktop).not.toHaveClass("bg-transparent");
    expect(phone).toHaveClass("bg-bg", "border-line");
    expect(phone).not.toHaveClass("bg-transparent");
  });
});
