<?php

namespace App\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use App\Service\UserCreator;
use Exception;

class CreateAdminCommand extends Command
{
    // the name of the command (the part after "bin/console")
    protected static $defaultName = 'app:create-admin';
    private $userCreator;

    public function __construct(UserCreator $userCreator)
    {
        $this->userCreator = $userCreator;

        parent::__construct();
    }

    protected function configure()
    {
        $this
            ->setDescription('Creates a new admin.')
            ->setHelp('This command allows you to create the "admin" user if it does not already exist');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        try {
            $res = $this->userCreator->createUser("admin", "firstName", "LastName", "admin_password", "admin@localhost", true);
            if ($res) {
                $output->writeln("Admin successfully generated!");
            } else {
                $output->writeln("Admin already existing");
            }
            return Command::SUCCESS;
        } catch (Exception $e) {
            $output->writeln($e);
            return Command::FAILURE;
        }
    }
}
