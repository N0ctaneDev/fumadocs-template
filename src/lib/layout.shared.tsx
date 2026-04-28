import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { siteConfig } from '__CONFIG__'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: siteConfig.name,
    },
  }
}
