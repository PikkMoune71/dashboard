import { useState } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

interface ColorPickerProps {
  color?: string;
  setColor: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, setColor }) => {
  const getInitialColor = () => {
    if (color) {
      const parts = color.split("-");
      return {
        base: parts[1] || "slate",
        intensity: parts[2] || "500",
      };
    }
    return { base: "slate", intensity: "500" };
  };

  const [baseColor, setBaseColor] = useState<string>(getInitialColor().base);
  const [intensity, setIntensity] = useState<string>(
    getInitialColor().intensity
  );
  const baseColors = [
    "slate",
    "stone",
    "red",
    "orange",
    "amber",
    "yellow",
    "lime",
    "green",
    "emerald",
    "teal",
    "cyan",
    "sky",
    "blue",
    "indigo",
    "violet",
    "purple",
    "pink",
    "fuchsia",
    "rose",
  ];

  const intensities = [
    "50",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ];

  const selectedColor = `bg-${baseColor}-${intensity}`;

  const handleColorChange = (color: string) => {
    setBaseColor(color);
    setColor(`bg-${color}-${intensity}`);
  };

  const handleIntensityChange = (int: string) => {
    setIntensity(int);
    setColor(`bg-${baseColor}-${int}`);
  };

  return (
    <div className="flex flex-col">
      <Label htmlFor="baseColor">Sélectionnez une couleur</Label>
      <div className="flex gap-2 my-4 flex-wrap">
        {baseColors.map((color) => (
          <Button
            key={color}
            className={`w-10 h-10 rounded-full bg-${color}-500 transition-all 
              ${
                baseColor === color
                  ? "ring-2 ring-primary hover:bg-${color}-500"
                  : "hover:ring-2 hover:ring-primary hover:bg-${color}-500"
              }`}
            onClick={() => handleColorChange(color)}
          />
        ))}
      </div>

      <Label htmlFor="intensity">Intensité de la couleur</Label>
      <div className="flex gap-2 my-4 flex-wrap">
        {intensities.map((int) => (
          <Button
            key={int}
            className={`w-10 h-10 rounded-full bg-${baseColor}-${int} transition-all 
              ${
                intensity === int
                  ? "ring-2 ring-primary hover:bg-${baseColor}-${int}"
                  : "hover:ring-2 hover:ring-primary hover:bg-${baseColor}-${int}"
              }`}
            onClick={() => handleIntensityChange(int)}
          />
        ))}
      </div>

      <div className="mt-4">
        <div
          className={`w-20 h-20 rounded-full ${
            color ? color : selectedColor
          } mx-auto`}
        />
        <p className="mt-2 text-sm text-gray-500 text-center">
          Couleur sélectionnée : {color ? color : selectedColor}
        </p>
      </div>
    </div>
  );
};

export default ColorPicker;
