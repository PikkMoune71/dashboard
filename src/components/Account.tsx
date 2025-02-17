import { userSchema } from "@/app/schemas/userSchemas";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useUser } from "@/composables/useFetchUser";
import { Button } from "./ui/button";
import Image from "next/image";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Pencil, Save } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";

export function Account() {
  const { user, loading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState(user);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user) {
      setEditableUser(user);
    }
  }, [user]);

  const name = editableUser
    ? `${editableUser.firstName} ${editableUser.lastName}`
    : "Utilisateur Inconnu";

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setEditableUser({
      ...editableUser!,
      [field]: e.target.value,
    });

    try {
      // Validation instantanée à chaque modification
      userSchema.pick({ [field]: true }).parse({
        [field]: e.target.value,
      });
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors[0]?.message || "Erreur de validation";
        setErrors((prevErrors) => ({ ...prevErrors, [field]: errorMessage }));
      }
    }
  };

  const handleSave = async () => {
    try {
      setErrors({});

      userSchema.parse(editableUser);

      if (editableUser?.id) {
        const userRef = doc(db, "users", editableUser.id);
        await updateDoc(userRef, {
          firstName: editableUser.firstName || "",
          lastName: editableUser.lastName || "",
          phone: editableUser.phone || "",
          bio: editableUser.bio || "",
        });

        setIsEditing(false);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur : ", error);
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Mon compte</h2>
        <Button
          className="p-2 rounded-xl"
          variant={isEditing ? "default" : "outline"}
          onClick={isEditing ? handleSave : handleEdit}
        >
          {isEditing ? (
            <>
              Enregister <Save size={16} />
            </>
          ) : (
            <>
              Editer <Pencil size={16} />
            </>
          )}
        </Button>
      </div>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <Card className="flex items-center justify-between gap-4 p-5 rounded-2xl flex-wrap">
            <div className="flex items-center gap-4 flex-wrap">
              <Image
                src={editableUser?.avatar || "/default-avatar.png"}
                alt={editableUser?.firstName || "User Avatar"}
                width={100}
                height={100}
                className="rounded-full"
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.png";
                }}
              />
              <div className="flex flex-col gap-1">
                <p className="text-xl">{name}</p>
                <p className="text-slate-500">{editableUser?.email}</p>
                <p className="text-gray-400 text-sm">
                  {editableUser?.bio ?? "Aucune biographie"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5 mt-4 rounded-2xl">
            <div className="flex justify-between items-center flex-wrap">
              <h3 className="font-bold text-lg">Information Personnelle</h3>
            </div>
            <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mt-4">
              <div className="my-2">
                <Label className="text-primary">Nom de famille</Label>
                {isEditing ? (
                  <Input
                    type="text"
                    className="w-full p-2 border border-gray-300"
                    value={editableUser?.lastName || ""}
                    onChange={(e) => handleChange(e, "lastName")}
                    error={errors.lastName}
                  />
                ) : (
                  <p>{editableUser?.lastName || "Inconnu"}</p>
                )}
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
              <div className="my-2">
                <Label className="text-primary">Prénom</Label>
                {isEditing ? (
                  <Input
                    type="text"
                    className="w-full p-2 border border-gray-300"
                    value={editableUser?.firstName || ""}
                    onChange={(e) => handleChange(e, "firstName")}
                    error={errors.firstName}
                  />
                ) : (
                  <p>{editableUser?.firstName || "Inconnu"}</p>
                )}
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>
              <div className="my-2">
                <Label className="text-primary">Email</Label>
                <p className="text-md">{editableUser?.email || "Non fourni"}</p>
              </div>
              <div className="my-2">
                <Label className="text-primary">Téléphone</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    className="w-full p-2 border border-gray-300"
                    value={editableUser?.phone || ""}
                    onChange={(e) => handleChange(e, "phone")}
                    error={errors.phone}
                  />
                ) : (
                  <p className="text-md">
                    {editableUser?.phone || "Aucun numéro de téléphone"}
                  </p>
                )}
              </div>
              <div className="my-2">
                <Label className="text-primary">Biographie</Label>
                {isEditing ? (
                  <Textarea
                    className="w-full p-2 border border-gray-300"
                    value={editableUser?.bio || ""}
                    onChange={(e) => handleChange(e, "bio")}
                    error={errors.bio}
                  />
                ) : (
                  <p className="text-md">
                    {editableUser?.bio || "Aucune biographie"}
                  </p>
                )}
                {errors.bio && (
                  <p className="text-red-500 text-sm">{errors.bio}</p>
                )}
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
