// @flow
import * as React from 'react'
import styles from './styles.css'

export const ButtonSpinner = () => <span className={styles.spinner} />

type Props = {
  children?: React.Node,
  className: string,
  id?: string,
  isLoading: boolean,
  onClick?: () => {},
  size: string,
  type?: ?string
}

export const Button = ({
  children,
  className = '',
  id,
  isLoading = false,
  onClick,
  size = 'normal',
  type
}: Props) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${styles[size]} ${className}`}
      id={id}
      type={type}
    >
      {isLoading ? <ButtonSpinner /> : children}
    </button>
  )
}
export default Button
