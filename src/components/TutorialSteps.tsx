import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useProjectStore, TutorialStep } from '@/lib/store'
import { Plus, Pencil, Trash2, Clock, Check, BookOpen, ArrowUp, ArrowDown } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

interface TutorialStepsProps {
  projectId: string
  steps: TutorialStep[]
}

export default function TutorialSteps({ projectId, steps }: TutorialStepsProps) {
  const { addTutorialStep, updateTutorialStep, deleteTutorialStep } = useProjectStore()
  const [isAddingStep, setIsAddingStep] = useState(false)
  const [editingStep, setEditingStep] = useState<TutorialStep | null>(null)
  const [newStep, setNewStep] = useState({
    title: '',
    description: '',
    estimatedTime: 30,
    imageUrl: '',
    materials: [] as string[]
  })

  const handleAddStep = () => {
    if (!newStep.title.trim()) return
    
    addTutorialStep(projectId, {
      ...newStep,
      completed: false
    })
    
    setNewStep({ title: '', description: '', estimatedTime: 30, imageUrl: '', materials: [] })
    setIsAddingStep(false)
  }

  const handleUpdateStep = () => {
    if (!editingStep) return
    
    updateTutorialStep(projectId, editingStep.id, editingStep)
    setEditingStep(null)
  }

  const handleToggleCompleted = (stepId: string, completed: boolean) => {
    updateTutorialStep(projectId, stepId, { completed })
  }

  const completedSteps = steps.filter(s => s.completed).length
  const totalTime = steps.reduce((sum, step) => sum + (step.estimatedTime || 0), 0)
  const progress = steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 0

  return (
    <Card className="tutorial-gradient">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Tutorial Steps
          </CardTitle>
          <Button
            onClick={() => setIsAddingStep(true)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Step
          </Button>
        </div>
        {steps.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{completedSteps}/{steps.length} steps completed</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {Math.round(totalTime / 60)}h {totalTime % 60}m total
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`border rounded-lg p-4 transition-colors ${
                step.completed ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' : 'bg-background'
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={step.completed}
                  onCheckedChange={(checked) => handleToggleCompleted(step.id, checked as boolean)}
                  className="mt-0.5"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      Step {index + 1}
                    </Badge>
                    {step.completed && (
                      <Badge variant="secondary" className="text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                    {step.estimatedTime && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {step.estimatedTime}m
                      </Badge>
                    )}
                  </div>
                  
                  <h4 className={`font-medium mb-2 ${step.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {step.title}
                  </h4>
                  
                  {step.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {step.description}
                    </p>
                  )}
                  
                  {step.imageUrl && (
                    <div className="mb-3">
                      <img
                        src={step.imageUrl}
                        alt={step.title}
                        className="w-full max-w-md h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {step.materials && step.materials.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-1">Materials needed:</p>
                      <div className="flex flex-wrap gap-1">
                        {step.materials.map((material, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingStep(step)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTutorialStep(projectId, step.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {steps.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No tutorial steps added yet</p>
              <p className="text-sm">Break down your project into manageable steps</p>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Add Step Dialog */}
      <Dialog open={isAddingStep} onOpenChange={setIsAddingStep}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Tutorial Step</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="stepTitle">Title *</Label>
              <Input
                id="stepTitle"
                value={newStep.title}
                onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                placeholder="Enter step title..."
              />
            </div>
            
            <div>
              <Label htmlFor="stepDescription">Description</Label>
              <Textarea
                id="stepDescription"
                value={newStep.description}
                onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                placeholder="Detailed instructions for this step..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="stepTime">Estimated Time (minutes)</Label>
              <Input
                id="stepTime"
                type="number"
                value={newStep.estimatedTime}
                onChange={(e) => setNewStep({ ...newStep, estimatedTime: parseInt(e.target.value) || 30 })}
                min="1"
              />
            </div>
            
            <div>
              <Label htmlFor="stepImage">Image URL</Label>
              <Input
                id="stepImage"
                value={newStep.imageUrl}
                onChange={(e) => setNewStep({ ...newStep, imageUrl: e.target.value })}
                placeholder="https://example.com/step-image.jpg"
              />
            </div>
            
            <div>
              <Label htmlFor="stepMaterials">Materials (comma-separated)</Label>
              <Input
                id="stepMaterials"
                value={newStep.materials.join(', ')}
                onChange={(e) => setNewStep({ 
                  ...newStep, 
                  materials: e.target.value.split(',').map(m => m.trim()).filter(Boolean)
                })}
                placeholder="drill, screws, wood glue..."
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddingStep(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStep}>
                Add Step
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Step Dialog */}
      <Dialog open={!!editingStep} onOpenChange={() => setEditingStep(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Tutorial Step</DialogTitle>
          </DialogHeader>
          
          {editingStep && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editStepTitle">Title *</Label>
                <Input
                  id="editStepTitle"
                  value={editingStep.title}
                  onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                  placeholder="Enter step title..."
                />
              </div>
              
              <div>
                <Label htmlFor="editStepDescription">Description</Label>
                <Textarea
                  id="editStepDescription"
                  value={editingStep.description}
                  onChange={(e) => setEditingStep({ ...editingStep, description: e.target.value })}
                  placeholder="Detailed instructions for this step..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="editStepTime">Estimated Time (minutes)</Label>
                <Input
                  id="editStepTime"
                  type="number"
                  value={editingStep.estimatedTime || 30}
                  onChange={(e) => setEditingStep({ ...editingStep, estimatedTime: parseInt(e.target.value) || 30 })}
                  min="1"
                />
              </div>
              
              <div>
                <Label htmlFor="editStepImage">Image URL</Label>
                <Input
                  id="editStepImage"
                  value={editingStep.imageUrl || ''}
                  onChange={(e) => setEditingStep({ ...editingStep, imageUrl: e.target.value })}
                  placeholder="https://example.com/step-image.jpg"
                />
              </div>
              
              <div>
                <Label htmlFor="editStepMaterials">Materials (comma-separated)</Label>
                <Input
                  id="editStepMaterials"
                  value={editingStep.materials?.join(', ') || ''}
                  onChange={(e) => setEditingStep({ 
                    ...editingStep, 
                    materials: e.target.value.split(',').map(m => m.trim()).filter(Boolean)
                  })}
                  placeholder="drill, screws, wood glue..."
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEditingStep(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateStep}>
                  Update Step
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}