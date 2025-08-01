import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Hammer, 
  Clock, 
  DollarSign, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  Play,
  CheckCircle2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Project } from '@/lib/store'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
  onView: (project: Project) => void
}

const statusConfig = {
  planning: { label: 'Planning', variant: 'secondary' as const, icon: Pencil },
  'in-progress': { label: 'In Progress', variant: 'default' as const, icon: Play },
  completed: { label: 'Completed', variant: 'success' as const, icon: CheckCircle2 },
  'on-hold': { label: 'On Hold', variant: 'warning' as const, icon: Clock },
}

const difficultyConfig = {
  beginner: { label: 'Beginner', class: 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200' },
  intermediate: { label: 'Intermediate', class: 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200' },
  advanced: { label: 'Advanced', class: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200' },
}

export default function ProjectCard({ project, onEdit, onDelete, onView }: ProjectCardProps) {
  const [isActionOpen, setIsActionOpen] = useState(false)
  
  const statusInfo = statusConfig[project.status]
  const StatusIcon = statusInfo.icon
  const difficultyInfo = difficultyConfig[project.difficulty]

  const materialsPurchased = project.materials.filter(m => m.purchased).length
  const totalMaterials = project.materials.length
  
  const estimatedCost = project.materials.reduce((sum, m) => sum + (m.cost || 0), 0)

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 project-gradient border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant={statusInfo.variant} className="flex items-center gap-1">
                <StatusIcon className="w-3 h-3" />
                {statusInfo.label}
              </Badge>
              <Badge variant="outline" className={difficultyInfo.class}>
                {difficultyInfo.label}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {project.estimatedTime}h
              </Badge>
            </div>
          </div>
          <DropdownMenu open={isActionOpen} onOpenChange={setIsActionOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(project)}>
                <Play className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(project)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(project.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {project.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src={project.imageUrl} 
              alt={project.title}
              className="w-full h-32 object-cover"
            />
          </div>
        )}
        
        <div className="space-y-3">
          {/* Progress */}
          {project.tutorialSteps.length > 0 && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
          )}
          
          {/* Materials Progress */}
          {totalMaterials > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Hammer className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Materials</span>
              </div>
              <span className="font-medium">
                {materialsPurchased}/{totalMaterials} purchased
              </span>
            </div>
          )}
          
          {/* Cost */}
          {estimatedCost > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Estimated Cost</span>
              </div>
              <span className="font-medium">${estimatedCost.toFixed(2)}</span>
            </div>
          )}
        </div>
        
        <Button 
          onClick={() => onView(project)}
          className="w-full mt-4"
          variant={project.status === 'completed' ? 'secondary' : 'default'}
        >
          {project.status === 'completed' ? 'View Project' : 'Continue Project'}
        </Button>
      </CardContent>
    </Card>
  )
}