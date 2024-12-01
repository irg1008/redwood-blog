export const deleteSearchParams = (...params: string[]) => {
  const url = new URL(window.location.href)
  params.forEach((param) => {
    url.searchParams.delete(param)
  })
  window.history.pushState({}, '', url)
}
