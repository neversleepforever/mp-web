import BaseLayout from "../BaseLayout"

export default function DarkLayout({ children }: { children: React.ReactNode }) {
  return <BaseLayout theme="dark">{children}</BaseLayout>
}
