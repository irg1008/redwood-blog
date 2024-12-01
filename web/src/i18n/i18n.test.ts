export const mockI18n = () => {
  jest.mock('react-i18next', () => ({
    useTranslation: jest.fn().mockReturnValue({
      t: (key: string) => key,
    }),
  }))
}

describe('i18n configuration', () => {
  beforeEach(() => {
    mockI18n()
  })

  it('should mock the i18n configuration', async () => {
    const { useTranslation } = await import('react-i18next')
    expect(useTranslation().t('common.name')).toEqual('common.name')
  })
})
