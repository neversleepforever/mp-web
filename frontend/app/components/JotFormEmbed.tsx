"use client"

export default function JotformEmbed({ formId }: { formId: string }) {
  return (
    <iframe
      src={`https://form.jotform.com/${formId}`}
      className="w-full border-none bg-transparent"
      style={{ height: "100%", minHeight: "100%" }}
      scrolling="yes"
      allowFullScreen
    />
  )
}