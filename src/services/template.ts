import { IExtensionContext } from "@mtbird/shared"

interface IPagination {
  pageNum: number;
  pageSize: number;
}

export const getTemplateList = (context: IExtensionContext, scope: string, pagination: IPagination, teamId?: string | null) => {
  return context.request.get(process.env.API_URL + '/template/component', {
    params: {
      scope,
      ...pagination,
      teamId
    },
    headers: {
      Authorization: 'Bears ' + context.storage.getItem('AUTH_TOKEN')
    }
  })
}

export const deleteTemplate = (context: IExtensionContext, id: string) => {
  return context.request.delete(process.env.API_URL + '/template', {
    data: {
      id
    },
    headers: {
      Authorization: 'Bears ' + context.storage.getItem('AUTH_TOKEN')
    }
  })
}