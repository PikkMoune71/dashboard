import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Pencil, Check } from "lucide-react";

interface EditButtonProps {
  value: string;
  onSave: (newValue: string) => void;
}

export const EditButton: React.FC<EditButtonProps> = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSave = () => {
    if (inputValue.trim() && inputValue !== value) {
      onSave(inputValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <Button
            onClick={handleSave}
            className="p-2 bg-green-600"
            disabled={!inputValue.trim() || inputValue === value}
          >
            <Check size={16} />
          </Button>
        </div>
      ) : (
        <>
          <span className="font-bold text-lg">{value}</span>
          <Button
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
            className="p-2 rounded-xl"
            variant="outline"
          >
            <Pencil size={16} />
          </Button>
        </>
      )}
    </div>
  );
};
