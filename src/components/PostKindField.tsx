'use client'

import type { SelectFieldClientComponent } from 'payload'

import { SelectField, useDocumentInfo, useField } from '@payloadcms/ui'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

// "New project" links pass ?kind=project; preselect it on documents that are not saved yet.
const PostKindField: SelectFieldClientComponent = (props) => {
  const { id } = useDocumentInfo()
  const { setValue, value } = useField<string>({ path: props.path })
  const requested = useSearchParams().get('kind')

  useEffect(() => {
    if (!id && (requested === 'article' || requested === 'project') && value !== requested) {
      setValue(requested)
    }
    // Only on first render of a new document.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, requested])

  return <SelectField {...props} />
}

export default PostKindField
