import React, { memo, useCallback } from 'react';
import { Box, Button, color, Stack, StackProps } from '@stacks/ui';
import { LOADING_KEYS, useLoading } from '@common/hooks/use-loading';
import { useDrawers } from '@common/hooks/use-drawers';
import { SpaceBetween } from '@components/space-between';
import { Caption } from '@components/typography';
import { NetworkRowItem } from '@components/network-row-item';
import { useTransactionError } from '@common/hooks/use-transaction-error';
import { FeeComponent } from '@components/transactions/fee';
import { useSignedTransaction } from '@common/hooks/use-transaction';
import { useHandleSubmitPendingTransaction } from '@common/hooks/use-tx-state';
import { TransactionErrorReason } from '@pages/transaction/transaction-error';
import { FiAlertTriangle } from 'react-icons/fi';

const MinimalErrorMessage = memo((props: StackProps) => {
  const error = useTransactionError();
  if (!error) return null;

  const getTitle = () => {
    if (error) {
      switch (error) {
        case TransactionErrorReason.Unauthorized:
          return 'Unauthorized request';
        case TransactionErrorReason.NoContract:
          return 'Contract not found';
        case TransactionErrorReason.StxTransferInsufficientFunds:
        case TransactionErrorReason.FeeInsufficientFunds:
          return 'Insufficient balance';
        case TransactionErrorReason.BroadcastError:
          return 'Broadcast error';
        case TransactionErrorReason.Generic:
          return 'Something went wrong';
      }
    }
    return null;
  };
  return (
    <Stack alignItems="center" bg="#FCEEED" p="base" borderRadius="12px" isInline {...props}>
      <Box color={color('feedback-error')} strokeWidth={2} as={FiAlertTriangle} />
      <Caption color={color('feedback-error')}>{getTitle()}</Caption>
    </Stack>
  );
});

export const TransactionsActions = memo((props: StackProps) => {
  const handleSubmitPendingTransaction = useHandleSubmitPendingTransaction();
  const signedTransaction = useSignedTransaction();
  const { setShowNetworks } = useDrawers();
  const error = useTransactionError();
  const { setIsLoading, setIsIdle, isLoading } = useLoading(LOADING_KEYS.SUBMIT_TRANSACTION);

  const handleSubmit = useCallback(async () => {
    setIsLoading();
    await handleSubmitPendingTransaction();
    setIsIdle();
  }, [setIsLoading, setIsIdle, handleSubmitPendingTransaction]);

  return (
    <Stack mt="auto" pt="loose" spacing="loose" bg={color('bg')} {...props}>
      <Stack spacing="base-loose">
        <SpaceBetween>
          <Caption>Fees</Caption>
          <Caption>
            <FeeComponent />
          </Caption>
        </SpaceBetween>
        <SpaceBetween>
          <Caption>Network</Caption>
          <NetworkRowItem onClick={() => setShowNetworks(true)} />
        </SpaceBetween>
      </Stack>
      <MinimalErrorMessage />
      <Button
        borderRadius="12px"
        py="base"
        width="100%"
        onClick={handleSubmit}
        isLoading={isLoading}
        isDisabled={!!error || !signedTransaction.value}
      >
        Confirm
      </Button>
    </Stack>
  );
});