import BaseLayout from "../BaseLayout"

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return <BaseLayout theme="default">{children}</BaseLayout>
}
