"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Minus, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"

interface Recipe {
  name: string
  category: string
  ingredients: { name: string; quantity: string }[]
  instructions: string[]
  notes: string
  image?: string
  cookTime: string
  servings: string
}

interface AddRecipeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddRecipe: (recipe: Recipe) => void
}

const categories = [
  "Appetizers",
  "Main Courses",
  "Desserts",
  "Beverages",
  "Salads",
  "Soups",
  "Breakfast",
  "Snacks",
  "Vegetarian",
  "Vegan",
]

export default function AddRecipeDialog({ open, onOpenChange, onAddRecipe }: AddRecipeDialogProps) {
  const [recipe, setRecipe] = useState<Recipe>({
    name: "",
    category: "",
    ingredients: [{ name: "", quantity: "" }],
    instructions: [""],
    notes: "",
    cookTime: "",
    servings: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipe.name || !recipe.category || recipe.ingredients.some((ing) => !ing.name)) {
      return
    }

    const cleanedRecipe = {
      ...recipe,
      ingredients: recipe.ingredients.filter((ing) => ing.name.trim() !== ""),
      instructions: recipe.instructions.filter((inst) => inst.trim() !== ""),
    }

    onAddRecipe(cleanedRecipe)
    setRecipe({
      name: "",
      category: "",
      ingredients: [{ name: "", quantity: "" }],
      instructions: [""],
      notes: "",
      cookTime: "",
      servings: "",
    })
    onOpenChange(false)
  }

  const addIngredient = () => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", quantity: "" }],
    }))
  }

  const removeIngredient = (index: number) => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }))
  }

  const updateIngredient = (index: number, field: "name" | "quantity", value: string) => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)),
    }))
  }

  const addInstruction = () => {
    setRecipe((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }))
  }

  const removeInstruction = (index: number) => {
    setRecipe((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }))
  }

  const updateInstruction = (index: number, value: string) => {
    setRecipe((prev) => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => (i === index ? value : inst)),
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setRecipe((prev) => ({ ...prev, image: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-amber-900">Add New Recipe</DialogTitle>
          <DialogDescription>Create a new recipe for your personal cookbook collection.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Recipe Name *</Label>
              <Input
                id="name"
                value={recipe.name}
                onChange={(e) => setRecipe((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter recipe name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={recipe.category}
                onValueChange={(value) => setRecipe((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cookTime">Cook Time</Label>
              <Input
                id="cookTime"
                value={recipe.cookTime}
                onChange={(e) => setRecipe((prev) => ({ ...prev, cookTime: e.target.value }))}
                placeholder="e.g., 30 minutes"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servings">Servings</Label>
              <Input
                id="servings"
                value={recipe.servings}
                onChange={(e) => setRecipe((prev) => ({ ...prev, servings: e.target.value }))}
                placeholder="e.g., 4 people"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Recipe Image</Label>
            <div className="flex items-center gap-4">
              <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image")?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Image
              </Button>
              {recipe.image && (
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  <img src={recipe.image || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Ingredients *</Label>
              <Button type="button" onClick={addIngredient} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Ingredient
              </Button>
            </div>
            <div className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <Card key={index} className="p-3">
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="Ingredient name"
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, "name", e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Quantity"
                      value={ingredient.quantity}
                      onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                      className="w-32"
                    />
                    {recipe.ingredients.length > 1 && (
                      <Button type="button" onClick={() => removeIngredient(index)} size="sm" variant="outline">
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Instructions</Label>
              <Button type="button" onClick={addInstruction} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Step
              </Button>
            </div>
            <div className="space-y-2">
              {recipe.instructions.map((instruction, index) => (
                <Card key={index} className="p-3">
                  <div className="flex gap-2 items-start">
                    <span className="text-sm font-medium text-amber-600 mt-2 min-w-[2rem]">{index + 1}.</span>
                    <Textarea
                      placeholder="Describe this step..."
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      className="flex-1 min-h-[60px]"
                    />
                    {recipe.instructions.length > 1 && (
                      <Button type="button" onClick={() => removeInstruction(index)} size="sm" variant="outline">
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={recipe.notes}
              onChange={(e) => setRecipe((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes, tips, or variations..."
              className="min-h-[80px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
              Save Recipe
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
