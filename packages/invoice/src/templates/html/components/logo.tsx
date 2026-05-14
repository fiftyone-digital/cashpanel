type Props = {
  logo: string;
  customerName: string;
  maxWidth?: number | null;
};

export function Logo({ logo, customerName, maxWidth = 150 }: Props) {
  const width = maxWidth ?? 150;

  return (
    <div className="flex justify-end" style={{ maxWidth: width }}>
      <img
        src={logo}
        alt={customerName}
        style={{
          maxWidth: width,
          maxHeight: 80,
          height: "auto",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
}
