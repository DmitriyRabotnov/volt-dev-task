import * as H from 'history'

export const linkTo = (
  history: H.History | null,
  where?: string,
  go: boolean = false,
  location: boolean = false
) => {
  const destination = `${where ? `/${where}/` : ``}`
  if (location) {
    window.location = (`${
      window.location.origin
    }${destination}` as unknown) as Location
    return
  }
  if (history) {
    history.push(destination)
    if (go) {
      history.go(0)
    }
  }
}
// history.push(`${id ? `/config/${id}` : ``}${where ? `/${where}/` : ``}`)
