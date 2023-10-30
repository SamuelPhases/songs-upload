interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>  {
    title: string
}

const Title = ({ title, ...props }: Props) => {
  return (
    <h1 className="text-lg lg:text-2xl text-white font-bold">{title}</h1>
  )
}

export default Title