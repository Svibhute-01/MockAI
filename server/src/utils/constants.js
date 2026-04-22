export const UserRolesEnum={
ADMIN:"admin",
PROJECT_ADMIN:"project_admin",
MEMBER:"member"
}


export  const AvailableUsersRole=Object.values(UserRolesEnum)

export const TaskStatusEnum={
    TO_DO:"todo",
    IN_PROGRESS:"in_progress",
    DONE:"done"
}

export const AvailbleTasStatuses=Object.values(TaskStatusEnum)