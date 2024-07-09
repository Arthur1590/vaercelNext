export default function hideWallet(wallet: string) {
    return `${wallet.slice(0, 4)}...${wallet.slice(wallet.length - 4, -1)}`
}
