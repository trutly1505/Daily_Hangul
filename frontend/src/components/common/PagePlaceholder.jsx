function PagePlaceholder({
  eyebrow = 'Scaffold',
  title,
  description,
  meta,
  framed = true,
  children,
}) {
  const className = framed ? 'panel empty-state' : 'empty-state'

  return (
    <section className={className}>
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
      {meta ? <div className="meta-pill">{meta}</div> : null}
      {children}
    </section>
  )
}

export default PagePlaceholder
