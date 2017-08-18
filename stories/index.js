import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import { Welcome } from '@storybook/react/demo'
import { Button, ButtonSpinner } from '../src/ui-kit/Button'

storiesOf('Welcome', module).add('to Storybook', () =>
  <Welcome showApp={linkTo('Button')} />
)

storiesOf('Button', module)
  .add('Standard', () =>
    <Button onClick={action('clicked')}>Hello Button</Button>
  )
  .add('with spinner', () =>
    <Button>
      <ButtonSpinner />
    </Button>
  )
