import { getProfile } from '@/src/lib/data/profile'
import { getProjects } from '@/src/lib/data/projects'
import { getSkills } from '@/src/lib/data/skills'
import HomeClient from '@/src/app/HomeClient'

export default async function Home() {
  const [profile, projects, skills] = await Promise.all([
    getProfile(),
    getProjects(),
    getSkills(),
  ])

  return <HomeClient profile={profile} projects={projects} skills={skills} />
}
