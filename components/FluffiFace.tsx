export default function FluffiFace({ ...props }) {
  return (
    <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="12" height="12" fill="black"/>
      <rect x="12" y="12" width="36" height="12" fill="black"/>
      <rect x="48" width="12" height="12" fill="black"/>
    </svg>
  )
}
