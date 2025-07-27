"use client"

import { Clock, Users, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Recipe {
  id: string
  name: string
  category: string
  ingredients: { name: string; quantity: string }[]
  instructions: string[]
  notes: string
  image?: string
  cookTime: string
  servings: string
  createdAt: string
}

interface RecipeDetailDialogProps {
  recipe: Recipe
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (id: string) => void
}

export default function RecipeDetailDialog({ recipe, open, onOpenChange, onDelete }: RecipeDetailDialogProps) {
  const handleDelete = () => {
    onDelete(recipe.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-3xl font-serif text-amber-900">{recipe.name}</DialogTitle>
              <div className="flex items-center gap-4 text-amber-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{recipe.cookTime || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{recipe.servings || "Not specified"}</span>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  {recipe.category}
                </Badge>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{recipe.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Recipe Image */}
            {recipe.image && (
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <img
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-serif text-amber-900">Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex justify-between items-center py-1">
                      <span className="text-amber-800">{ingredient.name}</span>
                      <span className="text-amber-600 font-medium">{ingredient.quantity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Notes */}
            {recipe.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-serif text-amber-900">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-amber-700 whitespace-pre-wrap">{recipe.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Instructions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-serif text-amber-900">Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <p className="text-amber-800 leading-relaxed pt-1">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="text-center text-sm text-amber-600">
          Added on {new Date(recipe.createdAt).toLocaleDateString()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
