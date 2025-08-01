import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useProjectStore, Project } from '@/lib/store'
import ProjectCard from '@/components/ProjectCard'
import CreateProjectDialog from '@/components/CreateProjectDialog'
import ProjectDetails from '@/components/ProjectDetails'
import { Plus, Search, Filter, Hammer, TrendingUp, CheckCircle2, Clock } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Index() {
  const { projects, deleteProject } = useProjectStore()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [viewingProject, setViewingProject] = useState<Project | null>(null)
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Mock data for demonstration
  const hasMockData = projects.length === 0
  if (hasMockData) {
    const mockProjects = [
      {
        id: '1',
        title: 'Kitchen Cabinet Makeover',
        description: 'Transform old kitchen cabinets with paint and new hardware for a fresh modern look.',
        category: 'Home Improvement',
        status: 'in-progress' as const,
        difficulty: 'intermediate' as const,
        estimatedTime: 16,
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        materials: [
          { id: '1', name: 'Cabinet Paint', quantity: 2, unit: 'gallons', purchased: true, cost: 89.99 },
          { id: '2', name: 'Cabinet Hardware', quantity: 20, unit: 'pieces', purchased: false, cost: 120.00 },
          { id: '3', name: 'Sandpaper', quantity: 5, unit: 'sheets', purchased: true, cost: 15.99 }
        ],
        tutorialSteps: [
          { id: '1', title: 'Remove Cabinet Doors', description: 'Carefully remove all cabinet doors and hardware', completed: true, estimatedTime: 60 },
          { id: '2', title: 'Sand Surfaces', description: 'Sand all surfaces to prepare for painting', completed: true, estimatedTime: 180 },
          { id: '3', title: 'Prime Cabinets', description: 'Apply primer to all cabinet surfaces', completed: false, estimatedTime: 120 },
          { id: '4', title: 'Paint Cabinets', description: 'Apply paint in thin, even coats', completed: false, estimatedTime: 180 }
        ],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z',
        progress: 50,
        budget: 300
      },
      {
        id: '2',
        title: 'Garden Storage Bench',
        description: 'Build a weatherproof storage bench for garden tools and outdoor cushions.',
        category: 'Garden',
        status: 'completed' as const,
        difficulty: 'beginner' as const,
        estimatedTime: 8,
        imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
        materials: [
          { id: '1', name: 'Cedar Boards', quantity: 6, unit: 'pieces', purchased: true, cost: 75.00 },
          { id: '2', name: 'Wood Screws', quantity: 1, unit: 'box', purchased: true, cost: 12.99 },
          { id: '3', name: 'Wood Stain', quantity: 1, unit: 'quart', purchased: true, cost: 28.99 }
        ],
        tutorialSteps: [
          { id: '1', title: 'Cut Wood to Size', description: 'Cut all cedar boards to the required dimensions', completed: true, estimatedTime: 45 },
          { id: '2', title: 'Assemble Frame', description: 'Build the basic frame structure', completed: true, estimatedTime: 90 },
          { id: '3', title: 'Add Storage Compartment', description: 'Create the internal storage space', completed: true, estimatedTime: 60 },
          { id: '4', title: 'Apply Stain', description: 'Stain the bench for weather protection', completed: true, estimatedTime: 90 }
        ],
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-18T16:45:00Z',
        progress: 100,
        budget: 150
      }
    ]
    
    // Add mock projects to store for demo
    mockProjects.forEach(project => {
      useProjectStore.getState().addProject({
        title: project.title,
        description: project.description,
        category: project.category,
        status: project.status,
        difficulty: project.difficulty,
        estimatedTime: project.estimatedTime,
        imageUrl: project.imageUrl,
        materials: [],
        tutorialSteps: []
      })
    })
  }

  const handleDeleteProject = (id: string) => {
    setDeletingProjectId(id)
  }

  const confirmDelete = () => {
    if (deletingProjectId) {
      deleteProject(deletingProjectId)
      setDeletingProjectId(null)
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setIsCreateDialogOpen(true)
  }

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false)
    setEditingProject(null)
  }

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesDifficulty = difficultyFilter === 'all' || project.difficulty === difficultyFilter
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesDifficulty && matchesCategory
  })

  // Statistics
  const totalProjects = projects.length
  const inProgressProjects = projects.filter(p => p.status === 'in-progress').length
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const averageProgress = totalProjects > 0 
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects) 
    : 0

  // Get unique categories for filter
  const categories = Array.from(new Set(projects.map(p => p.category)))

  if (viewingProject) {
    return (
      <ProjectDetails
        project={viewingProject}
        onBack={() => setViewingProject(null)}
        onEdit={handleEditProject}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Hammer className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange text-transparent bg-clip-text">
              DIY Project Hub
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Plan, track, and complete your home improvement projects with ease. 
            Manage materials, follow step-by-step tutorials, and see your progress.
          </p>
        </div>

        {/* Statistics Cards */}
        {totalProjects > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <Hammer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProjects}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{inProgressProjects}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedProjects}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{averageProgress}%</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            size="lg"
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Project
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            
            {categories.length > 0 && (
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                onView={setViewingProject}
              />
            ))}
          </div>
        ) : totalProjects === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="p-6 rounded-full bg-primary/10 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Hammer className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Start Your First Project</h3>
              <p className="text-muted-foreground mb-6">
                Create your first DIY project to start tracking materials, steps, and progress.
              </p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                size="lg"
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Create Your First Project
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find projects.
              </p>
            </div>
          </div>
        )}

        {/* Create/Edit Project Dialog */}
        <CreateProjectDialog
          open={isCreateDialogOpen}
          onOpenChange={handleCloseCreateDialog}
          project={editingProject}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingProjectId} onOpenChange={() => setDeletingProjectId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this project? This action cannot be undone.
                All materials, tutorial steps, and progress will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete Project
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}