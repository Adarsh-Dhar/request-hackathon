import { useRouter } from 'next/router'

export default function InvoiceDetailPage() {
  const router = useRouter()
  const { id } = router.query  // access the dynamic id parameter

  return (
    <div>
      <h1>Invoice {id}</h1>
      {/* Invoice detail content */}
    </div>
  )
} 