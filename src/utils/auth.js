export const getAuthenticationToken = (cookies) => {
  if (process.env.VUE_APP_OIDC_AUTHORITY) {
    const token = cookies.get("oidc")
    if (token) {
      return token.access_token
    } else {
      return null
    }
  }

  const token = cookies.get("jwt")

  if (token) {
    return token
  } else {
    return null
  }
}
