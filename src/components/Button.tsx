type ButtonProps = {
  name: string;
  size: string;
  edge: string;
  background: string;
  textColor: string;
  rounding: string;
  font?: string;
};

export default function Button({
  name = "Jogar",
  size,
  edge,
  background,
  textColor,
  rounding,
  font,
}: ButtonProps) {
  return (
    <button
      className={`
        ${size}
        ${edge}
        ${background}
        ${textColor}
        ${rounding}
        ${font}
      `}
    >
      {name}
    </button>
  );
}
