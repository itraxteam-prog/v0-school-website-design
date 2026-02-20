"use client"

import { motion, HTMLMotionProps, Variants } from "framer-motion"
import { ReactNode } from "react"

interface AnimatedWrapperProps extends HTMLMotionProps<"div"> {
    children: ReactNode
    delay?: number
    direction?: "up" | "down" | "left" | "right" | "none"
    distance?: number
    duration?: number
    staggerChildren?: number
}

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
}

export const staggerContainer: Variants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

export function AnimatedWrapper({
    children,
    delay = 0,
    direction = "up",
    distance = 10,
    duration = 0.4,
    staggerChildren,
    className,
    ...props
}: AnimatedWrapperProps) {
    const getInitial = () => {
        if (direction === "none") return { opacity: 0 }
        const axis = direction === "up" || direction === "down" ? "y" : "x"
        const sign = direction === "up" || direction === "left" ? 1 : -1
        return { opacity: 0, [axis]: sign * distance }
    }

    const variants: Variants = {
        hidden: getInitial(),
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration,
                delay,
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: staggerChildren
            }
        }
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={variants}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}
