import React from 'react';
import { color, Stack } from '@stacks/ui';

import { Title } from '@components/typography';
import { Divider } from '@components/divider';
import { AttachmentRow } from '@pages/sign-transaction/components/attachment-row';
import { Row } from '@pages/sign-transaction/components/row';
import { useTransactionRequestState } from '@store/transactions/requests.hooks';

export function StxTransferDetails(): JSX.Element | null {
  const pendingTransaction = useTransactionRequestState();

  if (!pendingTransaction || pendingTransaction.txType !== 'token_transfer') {
    return null;
  }

  return (
    <Stack
      spacing="loose"
      border="4px solid"
      borderColor={color('border')}
      borderRadius="12px"
      py="extra-loose"
      px="base-loose"
    >
      <Title as="h2" fontWeight="500">
        Transfer details
      </Title>
      <Stack divider={<Divider />} spacing="base">
        <Row name="Recipient" type="Principal" value={pendingTransaction.recipient} />
        <Row name="Amount" type="uSTX" value={pendingTransaction.amount} />
        {pendingTransaction.memo && (
          <Row name="Memo" type="string" value={pendingTransaction.memo} />
        )}
        {pendingTransaction.attachment && <AttachmentRow />}
      </Stack>
    </Stack>
  );
}