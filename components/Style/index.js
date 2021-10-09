import globals from '../../styles/globals.css'

const Globals = () => {
    return (
        <style jsx global>
            {globals}
        </style>
    )
}

const AppStyles = ({}) => {
    return <Globals />
}

export default AppStyles
