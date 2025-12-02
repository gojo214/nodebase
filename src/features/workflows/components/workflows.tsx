"use client"

import React from 'react'
import { useCreateWorkflow, useSuspenseWorkflows } from '../hooks/use-workflows'
import { EntityContainer, EntityHeader } from '@/components/entity-components';
import { useUpgradeModal } from '@/hooks/use-upgrade-modal';
import { useRouter } from 'next/navigation';

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows();
  return (
    <div className='flex-1 flex justify-center items-center'>
        {JSON.stringify(workflows.data, null, 2)}
    </div>
  )
}


export const WorkFlowsHeader = ({ disabled }: { disabled?: boolean }) => {
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();
  const router = useRouter();
  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => {
        handleError(error)
        console.error("Error creating workflow:", error);
      }
    })
  }

  return (
    <>
    {modal}
    <EntityHeader 
      title={"Workflows"}
      description='Create and manage your workflows'
      onNew={handleCreate}
      newButtonLabel='New Workflow' 
      disabled={disabled}
      isCreating={createWorkflow.isPending}
    />
    </>
  )
}

export const WorkflowsContainer = ({ children } : { children: React.ReactNode }) => {
  return (
    <EntityContainer
      header={<WorkFlowsHeader/>}
      search={<></>}
      pagination={<></>}
    >
      {children}
    </EntityContainer>
  )
}