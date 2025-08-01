import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Material {
  id: string
  name: string
  quantity: number
  unit: string
  purchased: boolean
  cost?: number
  notes?: string
}

export interface TutorialStep {
  id: string
  title: string
  description: string
  completed: boolean
  estimatedTime?: number
  imageUrl?: string
  materials?: string[]
}

export interface Project {
  id: string
  title: string
  description: string
  category: string
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  actualTime?: number
  imageUrl?: string
  materials: Material[]
  tutorialSteps: TutorialStep[]
  createdAt: string
  updatedAt: string
  progress: number
  budget?: number
  totalCost?: number
}

interface ProjectStore {
  projects: Project[]
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  addMaterial: (projectId: string, material: Omit<Material, 'id'>) => void
  updateMaterial: (projectId: string, materialId: string, updates: Partial<Material>) => void
  deleteMaterial: (projectId: string, materialId: string) => void
  addTutorialStep: (projectId: string, step: Omit<TutorialStep, 'id'>) => void
  updateTutorialStep: (projectId: string, stepId: string, updates: Partial<TutorialStep>) => void
  deleteTutorialStep: (projectId: string, stepId: string) => void
  calculateProgress: (projectId: string) => number
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      
      addProject: (project) => {
        const id = crypto.randomUUID()
        const now = new Date().toISOString()
        const newProject: Project = {
          ...project,
          id,
          createdAt: now,
          updatedAt: now,
          progress: 0,
        }
        set((state) => ({
          projects: [...state.projects, newProject]
        }))
      },
      
      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...updates, updatedAt: new Date().toISOString() }
              : project
          )
        }))
      },
      
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id)
        }))
      },
      
      addMaterial: (projectId, material) => {
        const materialId = crypto.randomUUID()
        const newMaterial = { ...material, id: materialId }
        
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? { 
                  ...project, 
                  materials: [...project.materials, newMaterial],
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }))
      },
      
      updateMaterial: (projectId, materialId, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  materials: project.materials.map((material) =>
                    material.id === materialId ? { ...material, ...updates } : material
                  ),
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }))
      },
      
      deleteMaterial: (projectId, materialId) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  materials: project.materials.filter((material) => material.id !== materialId),
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }))
      },
      
      addTutorialStep: (projectId, step) => {
        const stepId = crypto.randomUUID()
        const newStep = { ...step, id: stepId }
        
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? { 
                  ...project, 
                  tutorialSteps: [...project.tutorialSteps, newStep],
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }))
        
        // Recalculate progress
        get().calculateProgress(projectId)
      },
      
      updateTutorialStep: (projectId, stepId, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  tutorialSteps: project.tutorialSteps.map((step) =>
                    step.id === stepId ? { ...step, ...updates } : step
                  ),
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }))
        
        // Recalculate progress
        get().calculateProgress(projectId)
      },
      
      deleteTutorialStep: (projectId, stepId) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  tutorialSteps: project.tutorialSteps.filter((step) => step.id !== stepId),
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }))
        
        // Recalculate progress
        get().calculateProgress(projectId)
      },
      
      calculateProgress: (projectId) => {
        const project = get().projects.find(p => p.id === projectId)
        if (!project || project.tutorialSteps.length === 0) return 0
        
        const completedSteps = project.tutorialSteps.filter(step => step.completed).length
        const progress = Math.round((completedSteps / project.tutorialSteps.length) * 100)
        
        get().updateProject(projectId, { progress })
        return progress
      }
    }),
    {
      name: 'diy-project-store',
    }
  )
)