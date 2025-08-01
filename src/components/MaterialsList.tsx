import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useProjectStore, Material } from '@/lib/store'
import { Plus, Pencil, Trash2, Check, X, DollarSign, Package } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

interface MaterialsListProps {
  projectId: string
  materials: Material[]
}

export default function MaterialsList({ projectId, materials }: MaterialsListProps) {
  const { addMaterial, updateMaterial, deleteMaterial } = useProjectStore()
  const [isAddingMaterial, setIsAddingMaterial] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    quantity: 1,
    unit: '',
    cost: 0,
    notes: ''
  })

  const handleAddMaterial = () => {
    if (!newMaterial.name.trim()) return
    
    addMaterial(projectId, {
      ...newMaterial,
      purchased: false
    })
    
    setNewMaterial({ name: '', quantity: 1, unit: '', cost: 0, notes: '' })
    setIsAddingMaterial(false)
  }

  const handleUpdateMaterial = () => {
    if (!editingMaterial) return
    
    updateMaterial(projectId, editingMaterial.id, editingMaterial)
    setEditingMaterial(null)
  }

  const handleTogglePurchased = (materialId: string, purchased: boolean) => {
    updateMaterial(projectId, materialId, { purchased })
  }

  const totalCost = materials.reduce((sum, material) => sum + (material.cost || 0), 0)
  const purchasedItems = materials.filter(m => m.purchased).length

  return (
    <Card className="material-gradient">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Materials List
          </CardTitle>
          <Button
            onClick={() => setIsAddingMaterial(true)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Material
          </Button>
        </div>
        {materials.length > 0 && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{purchasedItems}/{materials.length} purchased</span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              Total: ${totalCost.toFixed(2)}
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {materials.map((material) => (
            <div
              key={material.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                material.purchased ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' : 'bg-background'
              }`}
            >
              <Checkbox
                checked={material.purchased}
                onCheckedChange={(checked) => handleTogglePurchased(material.id, checked as boolean)}
              />
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-medium ${material.purchased ? 'line-through text-muted-foreground' : ''}`}>
                    {material.name}
                  </span>
                  {material.purchased && (
                    <Badge variant="secondary" className="text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      Purchased
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{material.quantity} {material.unit}</span>
                  {material.cost && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {material.cost.toFixed(2)}
                    </span>
                  )}
                </div>
                {material.notes && (
                  <p className="text-xs text-muted-foreground mt-1">{material.notes}</p>
                )}
              </div>
              
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingMaterial(material)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMaterial(projectId, material.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {materials.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No materials added yet</p>
              <p className="text-sm">Add materials to track your project supplies</p>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Add Material Dialog */}
      <Dialog open={isAddingMaterial} onOpenChange={setIsAddingMaterial}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Material</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="materialName">Name *</Label>
              <Input
                id="materialName"
                value={newMaterial.name}
                onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                placeholder="Enter material name..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="materialQuantity">Quantity</Label>
                <Input
                  id="materialQuantity"
                  type="number"
                  value={newMaterial.quantity}
                  onChange={(e) => setNewMaterial({ ...newMaterial, quantity: parseFloat(e.target.value) || 1 })}
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor="materialUnit">Unit</Label>
                <Input
                  id="materialUnit"
                  value={newMaterial.unit}
                  onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                  placeholder="pcs, ft, lbs..."
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="materialCost">Cost ($)</Label>
              <Input
                id="materialCost"
                type="number"
                value={newMaterial.cost}
                onChange={(e) => setNewMaterial({ ...newMaterial, cost: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <Label htmlFor="materialNotes">Notes</Label>
              <Textarea
                id="materialNotes"
                value={newMaterial.notes}
                onChange={(e) => setNewMaterial({ ...newMaterial, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={2}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddingMaterial(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMaterial}>
                Add Material
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Material Dialog */}
      <Dialog open={!!editingMaterial} onOpenChange={() => setEditingMaterial(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
          </DialogHeader>
          
          {editingMaterial && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editMaterialName">Name *</Label>
                <Input
                  id="editMaterialName"
                  value={editingMaterial.name}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, name: e.target.value })}
                  placeholder="Enter material name..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editMaterialQuantity">Quantity</Label>
                  <Input
                    id="editMaterialQuantity"
                    type="number"
                    value={editingMaterial.quantity}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, quantity: parseFloat(e.target.value) || 1 })}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor="editMaterialUnit">Unit</Label>
                  <Input
                    id="editMaterialUnit"
                    value={editingMaterial.unit}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, unit: e.target.value })}
                    placeholder="pcs, ft, lbs..."
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="editMaterialCost">Cost ($)</Label>
                <Input
                  id="editMaterialCost"
                  type="number"
                  value={editingMaterial.cost || 0}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, cost: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <Label htmlFor="editMaterialNotes">Notes</Label>
                <Textarea
                  id="editMaterialNotes"
                  value={editingMaterial.notes || ''}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={2}
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEditingMaterial(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateMaterial}>
                  Update Material
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}