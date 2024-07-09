import * as Toast from '@radix-ui/react-toast'
import { Dispatch, MutableRefObject, SetStateAction, useEffect } from 'react'

export default function ToastComponent({
    title,
    success,
    description,
    open,
    setOpen,
    timerRef,
    duration = 1500,
}: {
    title: string
    success: boolean
    description: string
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    timerRef: MutableRefObject<number>
    duration?: number
}) {
    useEffect(() => {
        return () => window.clearTimeout(timerRef.current)
    }, [])

    return (
        <Toast.Provider swipeDirection="right" duration={duration}>
            <Toast.Root
                className={`ToastRoot text-white ${success ? 'bg-green-400' : 'bg-red-400'} rounded-[10px] p-[15px] grid grid-cols-[auto_max-content] [column-gap:15px] items-center [grid-template-areas:'title_action'_'description_action']`}
                open={open}
                onOpenChange={setOpen}
            >
                <Toast.Title className="[grid-area:title] mb-[5px] font-[500] text-[15px]">{title}</Toast.Title>
                <Toast.Description asChild>
                    <span className="[grid-area:description] m-0 text-[13px] leading-[1.3]">{description}</span>
                </Toast.Description>
                <Toast.Action className="[grid-area:action]" asChild altText="OK">
                    <button className="inline-flex itemc-center justify-center rounded-[4px] font-[500] text-[12px] p-[0_10px] leading-[25px] h-[25x] green">OK</button>
                </Toast.Action>
            </Toast.Root>
            <Toast.Viewport className="fixed top-[90px] right-0 p-[25px] flex flex-col gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
        </Toast.Provider>
    )
}
