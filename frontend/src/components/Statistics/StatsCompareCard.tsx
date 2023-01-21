import { useState } from "react"
import { Headline } from "../Headline/Headline"
import { Icon } from "../Icon/Icon"

type StatsCompareCardProps = {
    type: CompareTypes
    description: string
    count: number
}

export type CompareTypes = "water_bottle" | "people" | "cars" | "titanics" | "earths"
type CompareTypeProps = {
    singular: string
    plural: string
    icon: string
    compareWith?: CompareTypeProps
    iconClassName?: string
}

export const compareTypes: { [key in CompareTypes]: CompareTypeProps } = {
    ["water_bottle"]: {
        singular: "Water bottle",
        plural: "Water bottles",
        icon: "water_drop",
    },
    ["people"]: {
        singular: "People",
        plural: "Peoples",
        icon: "boy",
        iconClassName: "text-3xl sm:text-5xl -tracking-[20px] sm:-tracking-[30px]"
    },
    ["cars"]: {
        singular: "Car",
        plural: "Cars",
        icon: "directions_car",
        compareWith: {
            singular: "Truck",
            plural: "Trucks",
            icon: "local_shipping",
        },
    },
    ["titanics"]: {
        singular: "Titanic",
        plural: "Titanics",
        icon: "directions_boat",
        compareWith: {
            singular: "Airplane",
            plural: "Airplanes",
            icon: "flight",
        },
    },
    ["earths"]: {
        singular: "Earth",
        plural: "Earths",
        icon: "public",
        iconClassName: "text-lg sm:text-2xl tracking-[10px]"
    },
}

/**
 * Displays Stats for Compare Weights with different items.
 */
export const StatsCompareCard: React.FC<StatsCompareCardProps> = ({ type, description, count }) => {
    const compareWith = compareTypes[type].compareWith

    const [buttonState, setButtonState] = useState<"left" | "right">("left")

    return <div className="bg-white rounded-lg py-4 md:py-5 mb-2 md:mb-4">
        {!compareWith && <div className={`flex items-center justify-between pl-4 md:pl-8 ${type === "people" ? "pr-8 md:pr-10" : "pr-5"}`}>
            <div className="mr-2 md:mr-4">
                <Headline level={4} hasMargin={false}>{count} {count === 1 ? compareTypes[type].singular : compareTypes[type].plural}</Headline>
                <p className="text-gray-700">{description}</p>
            </div>

            <div className="grid grid-cols-10">
                {Array.from({ length: count < 20 ? count : 20 }).map((value, index) => <Icon className={`${compareTypes[type].iconClassName ?? "text-lg sm:text-2xl"} text-blue-700 ${(index === 0 || index === 10) && count > 20 ? "text-blue-100" : ""} ${(index === 1 || index === 11) && count > 20 ? "text-blue-300" : ""} ${(index === 2 || index === 12) && count > 20 ? "text-blue-500" : ""}`} key={index}>{compareTypes[type].icon}</Icon>)}
            </div>
        </div>}
        {compareWith && <div className="px-4 md:px-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <Headline level={4} hasMargin={false}>{count} {count === 1 ? (buttonState === "right" ? compareTypes[type].singular : compareWith.singular) : (buttonState === "left" ? compareWith.plural : compareTypes[type].plural)}</Headline>
                    <p className="text-gray-700">{description}</p>
                </div>

                <div className="flex">
                    <button onClick={() => setButtonState("right")} className={`flex items-center ${buttonState === "left" ? "bg-gray-100 text-gray-700" : "bg-blue-200 text-blue-800"} rounded-tl-lg rounded-bl-lg px-2 py-1`}><Icon>{compareTypes[type].icon}</Icon></button>
                    <button onClick={() => setButtonState("left")} className={`flex items-center ${buttonState === "right" ? "bg-gray-100 text-gray-700" : "bg-blue-200 text-blue-800"} rounded-tr-lg rounded-br-lg px-2 py-1`}><Icon>{compareWith.icon}</Icon></button>
                </div>
            </div>
            <div className="grid grid-cols-10 md:w-2/3">
                {Array.from({ length: count < 30 ? count : 30 }).map((value, index) => <Icon className={`${compareTypes[type].iconClassName ?? "text-lg sm:text-2xl"} text-blue-700 ${index < 10 && count > 30 ? "text-blue-300" : ""} ${index < 20 && count > 20 ? "text-blue-500" : ""}`} key={index}>{buttonState === "left" ? compareWith.icon : compareTypes[type].icon}</Icon>)}
            </div>
        </div>
        }
    </div >
}