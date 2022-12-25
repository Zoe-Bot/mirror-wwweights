import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import { SearchHeader } from "../../components/Header/SearchHeader"
import { Headline } from "../../components/Headline/Headline"
import { ItemPreviewBox } from "../../components/Item/ItemPreviewBox"
import { Pagination } from "../../components/Pagination/Pagination"
import { StatsCard } from "../../components/Statistics/StatsCard"
import { routes } from "../../services/routes/routes"
import { generateWeightString } from "../../services/utils/weight"

const DEFAULT_ITEMS_PER_PAGE = 16
const ITEMS_PER_PAGE_MAXIMUM = 100
const FIRST_PAGE = 1

export type Item = {
    id: number, // TODO: Change to string
    name: string
    slug: string
    weight: Weight,
    source?: string
    image?: string
    tags: {
        name: string
        slug: string
    }[]
}
export type Weight = {
    value: number
    aditionalValue?: number
    isCa: boolean
}

type Statistics = {
    heaviest: Item
    lightest: Item
    averageWeight: number // in gram
}

type WeightsListProps = {
    items: Item[]
    currentPage: number
    totalItems: number
    limit: number
    query: string
    statistics: Statistics
}

/** Base List for weights */
export default function WeightsList({ items, currentPage, totalItems, limit, query, statistics }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const siteTitle = `Latest ${currentPage > 1 ? `| Page ${currentPage} ` : ``}- World Wide Weights`

    return (<>
        {/* Meta Tags */}
        <Head>
            <title>{siteTitle}</title>
        </Head>

        {/* Search with related tags */}
        <SearchHeader query={query} />

        <div className="container mt-5">
            {/* Headline Weight */}
            <Headline level={3}>All weights</Headline>

            <div className="md:flex">
                <div className="md:w-1/2 lg:w-2/3 2xl:w-3/4 mr-10 mb-10 md:mb-0">
                    {/* Weights */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5 mb-10">
                        {items.map((item) => <ItemPreviewBox datacy="weights-list-item" key={item.id} name={item.name} slug={item.slug} weight={item.weight} imageUrl="https://picsum.photos/200" />)}
                    </div>

                    {/* Pagination */}
                    <Pagination totalItems={totalItems} currentPage={currentPage} itemsPerPage={limit} defaultItemsPerPage={DEFAULT_ITEMS_PER_PAGE} query={query} baseRoute={routes.weights.list} />
                </div>
                <div className="flex flex-col">
                    {/* Headline Statistics */}
                    <Headline level={3} className="md:hidden">Statistics</Headline>

                    {/* Statistics */}
                    <div className="gap-4 md:w-1/2 lg:w-1/3 2xl:w-1/4">
                        <StatsCard icon="weight" value={generateWeightString(statistics.heaviest.weight)} descriptionTop={statistics.heaviest.name} descriptionBottom="Heaviest" />
                        <StatsCard icon="eco" value={generateWeightString(statistics.lightest.weight)} descriptionTop={statistics.lightest.name} descriptionBottom="Lightest" />
                        <StatsCard icon="scale" value={`~${statistics.averageWeight} g`} descriptionBottom="Average" />
                    </div>
                </div>
            </div>
        </div>

    </>
    )
}

export const getServerSideProps: GetServerSideProps<WeightsListProps> = async (context) => {
    const currentPage = parseInt(context.query.page as string ?? FIRST_PAGE)
    const limit = parseInt(context.query.limit as string ?? DEFAULT_ITEMS_PER_PAGE)
    const query = context.query.query as string ?? ""

    // Validate Query
    if (currentPage < 1 || limit < 1 || limit > ITEMS_PER_PAGE_MAXIMUM) {
        return {
            notFound: true // Renders 404 page
        }
    }

    const [itemsResponse, statisticResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/query/v1/items/list?page=${currentPage}&limit=${limit}&query=${query}`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/query/v1/items/statistics`),
    ])
    const [items, statistics] = await Promise.all([
        itemsResponse.json(),
        statisticResponse.json()
    ])

    const totalItems = parseInt(itemsResponse.headers.get("x-total-count") ?? "100") // Faalback For tests its 100 in future (when our api is used) this information will come from body and this will be removed anyway 

    return {
        props: {
            items,
            currentPage,
            limit,
            totalItems,
            query,
            statistics
        }
    }
}
