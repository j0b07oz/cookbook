"use client"

import { useState, useEffect } from "react"
import { Plus, Search, BookOpen, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AddRecipeDialog from "@/components/add-recipe-dialog"
import RecipeDetailDialog from "@/components/recipe-detail-dialog"

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

export default function VirtualCookbook() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  // Load recipes from localStorage on component mount
  useEffect(() => {
    const savedRecipes = localStorage.getItem("cookbook-recipes")
    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes))
    }
  }, [])

  // Save recipes to localStorage whenever recipes change
  useEffect(() => {
    localStorage.setItem("cookbook-recipes", JSON.stringify(recipes))
  }, [recipes])

  const addRecipe = (recipe: Omit<Recipe, "id" | "createdAt">) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setRecipes((prev) => [...prev, newRecipe])
  }

  const deleteRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id))
  }

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || recipe.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(recipes.map((recipe) => recipe.category)))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-amber-600" />
            <h1 className="text-4xl font-bold text-amber-900 font-serif">My Virtual Cookbook</h1>
          </div>
          <p className="text-amber-700 text-lg">Your personal collection of cherished recipes</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 h-4 w-4" />
            <Input
              placeholder="Search recipes or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-amber-200 focus:border-amber-400"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 border-amber-200">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Recipe
          </Button>
        </div>

        {/* Recipe Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-amber-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-amber-800 mb-2">
              {recipes.length === 0 ? "Your cookbook is empty" : "No recipes found"}
            </h3>
            <p className="text-amber-600 mb-6">
              {recipes.length === 0
                ? "Start building your personal recipe collection by adding your first recipe!"
                : "Try adjusting your search terms or category filter."}
            </p>
            {recipes.length === 0 && (
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-amber-600 hover:bg-amber-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Recipe
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card
                key={recipe.id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-amber-200 bg-white/80 backdrop-blur-sm"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <CardHeader className="pb-3">
                  {recipe.image && (
                    <div className="w-full h-48 rounded-lg overflow-hidden mb-3">
                      <img
                        src={recipe.image || "/placeholder.svg"}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardTitle className="text-amber-900 font-serif text-xl">{recipe.name}</CardTitle>
                  <CardDescription className="flex items-center gap-4 text-amber-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{recipe.cookTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{recipe.servings}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-800">
                    {recipe.category}
                  </Badge>
                  <p className="text-sm text-amber-700 line-clamp-2">
                    {recipe.ingredients
                      .slice(0, 3)
                      .map((ing) => ing.name)
                      .join(", ")}
                    {recipe.ingredients.length > 3 && "..."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Recipe Dialog */}
        <AddRecipeDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddRecipe={addRecipe} />

        {/* Recipe Detail Dialog */}
        {selectedRecipe && (
          <RecipeDetailDialog
            recipe={selectedRecipe}
            open={!!selectedRecipe}
            onOpenChange={(open) => !open && setSelectedRecipe(null)}
            onDelete={deleteRecipe}
          />
        )}
      </div>
    </div>
  )
}
