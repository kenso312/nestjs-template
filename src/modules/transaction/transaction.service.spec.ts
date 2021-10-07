import { I18nRequestScopeService } from 'nestjs-i18n';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository } from '@repo/transaction.repository';
import { TransactionService } from './transaction.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TransactionService', () => {
  let service: TransactionService;
  let repo: TransactionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: I18nRequestScopeService,
          useValue: {
            t: () => '',
          },
        },
        {
          provide: getRepositoryToken(TransactionRepository),
          useClass: TransactionRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repo = module.get<TransactionRepository>(
      getRepositoryToken(TransactionRepository)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });
});
