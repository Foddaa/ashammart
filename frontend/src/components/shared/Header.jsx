import HeaderSection from '../HeaderComponents/HeaderSection'

export default function Header() {
  return (
    <section >
      <div className='bg-white flex flex-col border-b border-[var(--color-border-gray)] max-length-[1200px] '>
        <HeaderSection />
      </div>
    </section>
  )
}
