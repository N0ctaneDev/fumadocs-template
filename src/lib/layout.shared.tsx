import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { siteConfig, githubConfig } from '__CONFIG__'
import logo from '@/app/icon.svg'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image src={logo} alt="logo" width={20} height={20} />
          <span className="font-medium in-[.uwu]:hidden max-md:hidden">`${siteConfig.name}`</span>
        </>
      )
    },
    githubUrl: `https://github.com/${githubConfig.user}/${githubConfig.repo}`,
  }
}
