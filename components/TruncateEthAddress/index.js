const TruncateEthAddress = ({ address }) => {
    const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/

    const truncateEthAddress = (address) => {
        const match = address.match(truncateRegex)
        if (!match) return address
        return `${match[1]}…${match[2]}`
    }

    return truncateEthAddress(address)
}

export default TruncateEthAddress
