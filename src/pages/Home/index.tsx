import Stack from '@material-hu/mui/Stack';

import Title from '@material-hu/components/design-system/Title';

export const HomePage = () => {
  return (
    <Stack sx={{ gap: 3, p: 3 }}>
      <Title
        title="Welcome"
        description="Your Humand app is ready. Start building."
        variant="XL"
      />
    </Stack>
  );
};
