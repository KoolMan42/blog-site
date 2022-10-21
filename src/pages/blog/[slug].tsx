import {getAllPosts, getPostBySlug} from "../../lib/api";
import markdownToHtml from "../../lib/util";
import {useRouter} from "next/router";

type Props = {
  post: PostType
  morePosts: PostType[]
  preview?: boolean
}
type PostType = {
  slug: string
  title: string
  date: string
  coverImage: string
  author: Author
  excerpt: string
  ogImage: {
    url: string
  }
  content: string
}
type Author = {
  name: string
  picture: string
}

export default function Post({ post, morePosts, preview }: Props) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <div>404</div>
  }
  return (
   <p>{ JSON.stringify(morePosts)} {JSON.stringify(preview)}
   {JSON.stringify(post)}
   </p>
  )
}

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
  ])
  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}