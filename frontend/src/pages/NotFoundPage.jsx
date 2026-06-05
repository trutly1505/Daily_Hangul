import { Link } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder.jsx'

function NotFoundPage() {
  return (
    <PagePlaceholder
      eyebrow="404"
      title="The requested route does not exist"
      description="The router fallback is active, so unknown URLs now land in a dedicated not found page."
      meta="Fallback route"
    >
      <div className="placeholder-actions">
        <Link className="button button-primary" to="/">
          Return home
        </Link>
      </div>
    </PagePlaceholder>
  )
}

export default NotFoundPage
